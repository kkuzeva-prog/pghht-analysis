import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sheetUrl } = await req.json();
    
    // 1. Извличане на ID на таблицата
    const sheetId = sheetUrl.match(/\/d\/(.*?)(\/|$)/)?.[1];
    if (!sheetId) return NextResponse.json({ error: 'Невалиден линк към Google Sheet' }, { status: 400 });

    // 2. Подготовка на ключа (оправяне на проблемите с новите редове в Netlify)
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    const formattedKey = rawKey.includes('\\n') 
      ? rawKey.replace(/\\n/g, '\n') 
      : rawKey.replace(/\n/g, '\n');

    // 3. Авторизация
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      formattedKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // 4. Опит за четене на данни (Лист 1, колони A до Z)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:Z100', 
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Таблицата е празна или нямате достъп до нея.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Успешно прочетени ${rows.length} реда! Веригата работи.` 
    });

  } catch (error: any) {
    console.error('Грешка:', error);
    return NextResponse.json({ 
      error: `Техническа грешка: ${error.message}. Уверете се, че имейлът в Netlify и Google Sheet съвпадат.` 
    }, { status: 500 });
  }
}
