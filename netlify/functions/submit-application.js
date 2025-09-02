exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { charName, charClass, message } = JSON.parse(event.body);
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  const payload = {
    embeds: [
      {
        title: 'New Guild Application!',
        color: 5814783, // A nice blue color
        fields: [
          { name: 'Character Name', value: charName, inline: true },
          { name: 'Class', value: charClass, inline: true },
          { name: 'Message', value: message },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Application submitted successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error submitting the application.' }),
    };
  }
};
