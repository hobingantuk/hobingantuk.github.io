export const generateEmailContent = (
  name: string,
  email: string,
  inquiryType: string,
  message: string
) => {
  // Define custom intros per inquiry type
  const intros: Record<string, string> = {
    "Job Offer": `I would love to discuss a potential job opportunity with you.`,
    Inquiry: `I have some questions regarding your work and would appreciate your insights.`,
    Collaboration: `I am interested in collaborating on a project with you.`,
    Support: `I need assistance with a certain issue and would love your help.`,
    Other: `I wanted to reach out and discuss something with you.`,
  };

  // Define dynamic question prefixes based on the inquiry type
  const questionPrefixes: Record<string, string> = {
    "Job Offer": `Here are the job details:`,
    Inquiry: `The question I have is:`,
    Collaboration: `I would love to collaborate on:`,
    Support: `The issue I'm facing is:`,
    Other: `Here's what I wanted to discuss:`,
  };

  // Get intro and question prefix dynamically
  const introText = intros[inquiryType] || intros["Other"];
  const questionPrefix =
    questionPrefixes[inquiryType] || questionPrefixes["Other"];

  return `
  Hi Bagus,
  
  My name is ${name}. ${introText}
  
  ${questionPrefix}
  
  ${message}
  
  Looking forward to your response.
  
  Best regards,  
  ${name}  
  Email: ${email}
    `.trim();
};
