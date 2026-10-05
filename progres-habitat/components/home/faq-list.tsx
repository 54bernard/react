import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FaqItem } from '@/types';

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible defaultValue={items[0]?.id} className="border-t border-ink-950/10">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
