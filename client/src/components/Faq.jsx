import React, { useState } from 'react';

const FAQComponent = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleAnswer = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: 'What should I pack for a camping trip?',
      answer:
        'You should pack essentials like a tent, sleeping bag, clothing appropriate for the weather, a first aid kit, a flashlight, food and water, and a portable stove.',
    },
    {
      question: 'How do I prepare for a trekking expedition?',
      answer:
        'Start with conditioning exercises, invest in quality hiking boots, check your equipment (like a GPS and compass), and research the trail to understand the terrain and weather conditions.',
    },
    {
      question: 'What is the best time of year to go camping?',
      answer:
        'The best time to go camping depends on the location, but generally, spring and fall offer mild weather and fewer bugs. Summer can be great but be mindful of high temperatures in some regions.',
    },
    {
      question: 'Is it safe to go trekking alone?',
      answer:
        'Trekking alone can be risky. It’s better to go with a group, especially in unfamiliar or challenging terrain. Always inform someone of your route and expected return time.',
    },
    {
      question: 'What are the best trekking trails in the world?',
      answer:
        'Some of the best trekking trails include the Inca Trail in Peru, the Everest Base Camp trek in Nepal, the Appalachian Trail in the USA, and the Torres del Paine Circuit in Chile.',
    },
  ];

  return (
    <div className="faq-container mx-auto my-12 max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">Camping & Trekking FAQ</h2>
      <div className="faq-list space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item border border-gray-100 rounded-md">
            <div
              className={`faq-question p-4 cursor-pointer rounded-md shadow-sm transition-all ${
                activeQuestion === index ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50 text-gray-800'
              }`}
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
            </div>
            {activeQuestion === index && (
              <div className="faq-answer mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;
