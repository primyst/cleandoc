import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: 20 }}>
      <h1>Welcome, {firstName}! 👋</h1>
      <p>
        You’ve just joined <b>CleanDoc</b> — where messy text becomes magic ✨
      </p>
      <p>Start cleaning your text today!</p>
    </div>
  );
}