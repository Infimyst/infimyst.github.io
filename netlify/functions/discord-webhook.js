// No need to require 'node-fetch', it's already available globally in Netlify Functions
// const fetch = require('node-fetch');

exports.handler = async function(event) {
  // This check is perfect
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the data from the our fetch request's body
  const data = JSON.parse(event.body);
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // Your logic for building the fields is great
  const fields = [
    { name: 'Discord Name', value: data.discord },
    { name: 'Character Name & Server', value: data.character },
    { name: 'Mainspec', value: data.mainspec },
    { name: 'Dealbreakers', value: data.dealbreakers },
    { name: 'Guild Contacts', value: data.contacts } // This will be handled gracefully if empty
  ];

  const payload = {
    embeds: [
      {
        title: 'New Guild Application',
        color: 5814783, // A nice blue color
        // This is a great way to filter out empty optional fields and add a default value
        fields: fields
          .filter(f => f.value) // Remove any fields that are empty
          .map(f => ({ name: f.name, value: f.value, inline: false }))
      }
    ]
  };
  
  // If the 'contacts' field was empty, add a placeholder
  if (!data.contacts) {
      payload.embeds[0].fields.push({ name: 'Guild Contacts', value: 'N/A', inline: false });
  }


  // Your fetch call is perfect
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // Log the error from Discord if something went wrong
        const errorText = await response.text();
        console.error('Discord API Error:', errorText);
        return { statusCode: 500, body: 'Error sending to Discord.' };
    }

    return { statusCode: 200, body: 'Application sent!' };
  } catch (error) {
    console.error('Fetch Error:', error);
    return { statusCode: 500, body: 'Error sending to Discord: ' + error.message };
  }
};