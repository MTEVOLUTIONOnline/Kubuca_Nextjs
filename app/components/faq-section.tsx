import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqItems = [
    {
      question: "Qual é o prazo de recebimento?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Vocês disponibilizam área de membros? Como funciona?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Vocês têm sistema de coprodução?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Tem canal de 1-clique?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "É possível vender produtos por recorrência (assinatura)?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Posso usar para vender serviços digitais? (ex: Mentoria)",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Aceita produtos físicos também?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Tem sistema de afiliados?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      question: "Comprei um produto na Kiwify e preciso de ajuda, como proceder?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    }
  ]
  
  export default function FAQSection() {
    return (
      <section className="py-24" id="faq">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    )
  }
  