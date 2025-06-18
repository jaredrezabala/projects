// index.js
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';
import { createClient } from '@supabase/supabase-js';
import schedule from 'node-schedule';


const supabase = createClient('https://dlnpsfjgytdimtesuekk.supabase.co', process.env.SUPA_KEY);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('WhatsApp bot is ready!');

 const today = new Date();
  const fecha = today.toISOString().split('T')[0]; // formato YYYY-MM-DD

  const { data, error } = await supabase
    .from('diet_calendar')
    .select('*')
    .eq('fecha', fecha)
    .order('hora', { ascending: true });

  if (error) {
    console.error('❌ Error al consultar Supabase:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No hay comidas programadas para hoy.');
    return;
  }

  console.log(`📅 Programando ${data.length} recordatorios para hoy (${fecha})`);

  for (const item of data) {
    const [hour, minute] = item.hora.split(':').map(Number);
    const jobTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);

    // Mensaje que se enviará
    const mensaje = `🕒 *${item.comida.toUpperCase()}* - ${item.descripcion}`;

    // Programar envío
    schedule.scheduleJob(jobTime, async () => {
      const chatId = '593987901048@c.us';
      await client.sendMessage(chatId, mensaje);
      console.log(`📤 Mensaje enviado: "${mensaje}" a las ${item.hora}`);
    });
  }
//   for (const item of data) {
//   const jobTime = new Date(Date.now() + 60000); // 1 minuto después

//   const mensaje = `🕒 *${item.comida.toUpperCase()}* - ${item.descripcion}`;

//   schedule.scheduleJob(jobTime, async () => {
//     const chatId = '593987901048@c.us';
//     await client.sendMessage(chatId, mensaje);
//     console.log(`📤 Mensaje enviado: "${mensaje}" (test)`);
//   });
// }

});

client.initialize();
