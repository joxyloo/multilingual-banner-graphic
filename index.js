const OpenAI = require('openai');
const { Bannerbear } = require('bannerbear');

const copywriting = {
  en: {
    pretitle: 'Prioritize Your Fitness with Us',
    maintitle: 'Start Your Home Gym Today',
    CTA: 'View Catalog',
  },
  cn: {},
  es: {},
  id: {},
};

(async () => {
  
  const openai = new OpenAI();
  const bb = new Bannerbear('your_api_key');

  for (let lang in copywriting) {
    if (lang !== 'en') {
      for (let text in copywriting.en) {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a professional copywriter and translator.' },
            {
              role: 'user',
              content: `Translate the copywriting
               for a fitness equipment company to ${lang} (ISO 639 language code) and return only the translated text. Make the content relevant to the local context while retaining the meaning, tone (e.g., formal, casual, humorous) and style of the original text: ${copywriting.en[text]}`,
            },
          ],
          model: 'gpt-3.5-turbo',
        });

        copywriting[lang][text] = completion.choices[0].message.content;
      }
    }

    const images = await bb.create_image(
      'your_template_id',
      {
        modifications: [
          {
            name: 'pretitle',
            text: copywriting[lang].pretitle,
          },
          {
            name: 'maintitle',
            text: copywriting[lang].maintitle,
          },
          {
            name: 'CTA',
            text: copywriting[lang].CTA,
          },
        ],
      },
      true
    );

    console.log(images.image_url);
  }
})();
