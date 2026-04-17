import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sheetUrl } = await req.json();
    const sheetId = sheetUrl.match(/\/d\/(.*?)(\/|$)/)?.[1];
    
    if (!sheetId) return NextResponse.json({ error: 'Невалиден линк!' }, { status: 400 });

    // ПРОВЕРКА 1: Има ли ги изобщо ключовете?
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ 
        error: `Липсват ключове в Netlify! Имейл: ${!!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}, Ключ: ${!!process.env.GOOGLE_PRIVATE_KEY}` 
      }, { status: 500 });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:A2', 
    });

    return NextResponse.json({ success: true, message: 'Успешна връзка!' });

  } catch (error: any) {
    // ТУК Е МАГИЯТА: Сайтът ще ни каже точната причина
    return NextResponse.json({ 
      error: `Грешка от Google: ${error.message}. Проверен имейл: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}` 
    }, { status: 500 });
  }
}
    
