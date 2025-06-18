// src/upload.js
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar Supabase
const supabase = createClient('https://dlnpsfjgytdimtesuekk.supabase.co', process.env.SUPA_KEY);

// Leer el archivo JSON
const jsonPath = path.resolve('./data/sample.json');
const fileContent = fs.readFileSync(jsonPath, 'utf-8');
const calendarData = JSON.parse(fileContent);

// Subir los datos a Supabase
async function uploadCalendar() {
  const { data, error } = await supabase
    .from('diet_calendar')
    .insert(calendarData);

  if (error) {
    console.error('❌ Error al subir datos:', error.message);
    return;
  }

  if (data) {
  console.log(`✅ Calendario subido con éxito: ${data.length} registros.`);
} else {
  console.log('✅ Calendario subido con éxito.');
}

}

uploadCalendar();
