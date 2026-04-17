import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sheetUrl } = await req.json();
    
    // Извличане на ID-то на таблицата от линка
    const sheetId = sheetUrl.match(/\/d\/(.*?)(\/|$)/)?.[1];
    
    if (!sheetId) {
      return NextResponse.json({ error: 'Невалиден линк към Google Sheet' }, { status: 400 });
    }

    // Настройка на достъпа с ключовете, които сложи в Netlify
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Вземане на данните от първия лист
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:Z100', // Чете първите 100 реда
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Таблицата е празна' }, { status: 404 });
    }

    // ТУК Е МЯСТОТО, КЪДЕТО ЩЕ ДОБАВИМ AI АНАЛИЗА СЛЕД МАЛКО
    // Засега просто ще върнем броя на намерените редове като тест
    return NextResponse.json({ 
      success: true, 
      message: `Успешно прочетени ${rows.length} реда от таблицата!`,
      data: rows 
    });

  } catch (error: any) {
    console.error('Грешка:', error);
    return NextResponse.json({ error: 'Грешка при връзката с Google: ' + error.message }, { status: 500 });
  }
}
