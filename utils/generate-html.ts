import type { Result, Category } from "@/components/work-life-balance-audit"

// Function to create an HTML file with results that can be saved and printed
export function generateHtml(
  name: string,
  email: string,
  overallScore: number,
  results: Result[],
  categoryLabels: Record<Category, string>,
  personalizedFeedback: { category: Category; feedback: string }[],
): string {
  // Create HTML content
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Work-Life Balance Results for ${name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 200px;
          height: auto;
        }
        h1 {
          color: #E26C73;
          margin-top: 15px;
        }
        h2 {
          color: #075D2D;
          border-bottom: 2px solid #E26C73;
          padding-bottom: 5px;
          margin-top: 30px;
        }
        .score-container {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
          border-left: 5px solid #E26C73;
        }
        .category {
          margin-bottom: 15px;
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .progress-bar {
          height: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #E26C73, #075D2D);
        }
        .feedback {
          margin-bottom: 8px;
        }
        .links a {
          display: block;
          color: #E26C73;
          font-weight: bold;
          text-decoration: none;
          margin-bottom: 10px;
        }
        .links a:nth-child(2) {
          color: #075D2D;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://make-time-for-more.vercel.app/images/logo.png" alt="Make Time For More Logo" class="logo">
        <h1>Work-Life Balance Audit Results</h1>
        <p>Prepared for: ${name} (${email})</p>
      </div>
      
      <div class="score-container">
        <h2 style="margin-top: 0; margin-bottom: 10px;">Overall Score: ${overallScore}%</h2>
        <p style="color: ${overallScore < 40 ? "#dc3545" : overallScore < 70 ? "#ffc107" : "#28a745"}; font-weight: bold; font-size: 18px;">
          ${overallScore < 40 ? "Needs significant improvement" : overallScore < 70 ? "Room for improvement" : overallScore < 90 ? "Good balance" : "Excellent balance"}
        </p>
      </div>
      
      <h2>Category Breakdown</h2>
      <div>
  `

  // Add each category result
  results.forEach((result) => {
    const percentage = Math.round(result.percentage)
    const color = percentage < 40 ? "#dc3545" : percentage < 70 ? "#ffc107" : "#28a745"

    html += `
      <div class="category">
        <div class="category-header">
          <span style="font-weight: bold;">${categoryLabels[result.category]}</span>
          <span style="color: ${color};">${percentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `
  })

  html += `
      </div>
      
      <h2>Personalized Feedback</h2>
      <div>
        <ul>
  `

  // Add personalized feedback based on lowest scores
  personalizedFeedback.forEach((item) => {
    html += `<li class="feedback"><strong>${categoryLabels[item.category]}:</strong> ${item.feedback}</li>`
  })

  html += `
        </ul>
      </div>
      
      <h2>Next Steps</h2>
      <div class="links">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header">
          → Apply Now to Work with Thought Leader Barbara
        </a>
        <a href="https://www.maketimeformore.com/products/apply">
          → Learn More About The Experience/Business Model & SOP Installation
        </a>
        <a href="https://chatgpt.com/g/g-67f5422677308191aa28a86d8ae5084e-free-work-life-balance-audit-for-women-founders">
          → Access Cherry Blossom for More Insights
        </a>
      </div>
      
      <div class="footer">
        <p>"You didn't leave your high-stress role just to rebuild burnout inside your business."</p>
        <p>- Thought Leader Barbara, Work-Life Balance Mentor</p>
        <p>© ${new Date().getFullYear()} Make Time For More™ | <a href="https://www.maketimeformore.com" style="color: #E26C73;">www.maketimeformore.com</a></p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <p><strong>Tip:</strong> Press Ctrl+P (or Cmd+P on Mac) to print this page or save as PDF.</p>
      </div>
    </body>
    </html>
  `

  return html
}
