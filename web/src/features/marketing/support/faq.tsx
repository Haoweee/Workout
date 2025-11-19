import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { frequentlyAskedQuestions } from '@/constants/faqs';

export const FAQs = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {frequentlyAskedQuestions.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b">
            <AccordionTrigger className="py-4 text-left text-gray-900 font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-700">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
