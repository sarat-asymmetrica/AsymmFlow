import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';

// Helper to get Graph client with token from cookies
function getGraphClient(token: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    }
  });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('onedrive_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/drive/root';
  const search = searchParams.get('search');
  
  try {
    const client = getGraphClient(token);
    
    if (search) {
      // Search for files
      const response = await client
        .api(`/drive/root/search(q='${search}')`)
        .select('id,name,size,webUrl,lastModifiedDateTime,folder,file,parentReference')
        .get();
      
      return NextResponse.json(response.value);
    } else {
      // List files in path
      const response = await client
        .api(`${path}/children`)
        .select('id,name,size,webUrl,lastModifiedDateTime,folder,file,parentReference')
        .get();
      
      return NextResponse.json(response.value);
    }
  } catch (error: any) {
    console.error('OneDrive API error:', error);
    
    // Check if token expired
    if (error.statusCode === 401) {
      return NextResponse.json({ error: 'Token expired', requiresAuth: true }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('onedrive_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const { fileId, action } = await request.json();
    const client = getGraphClient(token);
    
    switch (action) {
      case 'download':
        // Get download URL for file
        const downloadResponse = await client
          .api(`/drive/items/${fileId}`)
          .select('id,name,@microsoft.graph.downloadUrl')
          .get();
        
        return NextResponse.json({ downloadUrl: downloadResponse['@microsoft.graph.downloadUrl'] });
      
      case 'excel-parse':
        // Parse Excel file content
        const session = await client
          .api(`/drive/items/${fileId}/workbook/createSession`)
          .post({ persistChanges: false });
        
        const worksheets = await client
          .api(`/drive/items/${fileId}/workbook/worksheets`)
          .header('workbook-session-id', session.id)
          .get();
        
        const data = [];
        
        for (const worksheet of worksheets.value) {
          try {
            const range = await client
              .api(`/drive/items/${fileId}/workbook/worksheets/${worksheet.id}/usedRange`)
              .header('workbook-session-id', session.id)
              .get();
            
            if (range.values) {
              data.push({
                worksheetName: worksheet.name,
                data: range.values,
                rowCount: range.rowCount,
                columnCount: range.columnCount
              });
            }
          } catch (err) {
            console.log(`No data in worksheet ${worksheet.name}`);
          }
        }
        
        // Close session
        await client
          .api(`/drive/items/${fileId}/workbook/closeSession`)
          .header('workbook-session-id', session.id)
          .post({});
        
        return NextResponse.json({ 
          fileId,
          worksheets: data,
          totalSheets: worksheets.value.length
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('OneDrive operation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}