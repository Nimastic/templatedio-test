import { NextResponse } from 'next/server';

export async function POST(request) {
  const { 
    headerTitle, 
    headerContent, 
    bodyTitle, 
    bodyContent, 
    footerTitle, 
    footerContent, 
    audience 
  } = await request.json();

  // Validate required fields
  if (!headerTitle || !headerContent || !bodyTitle || !bodyContent || !footerTitle || !footerContent || !audience) {
    return NextResponse.json({ error: 'Missing one or more required fields.' }, { status: 400 });
  }

  const apiKey = process.env.TEMPLATED_API_KEY;
  const templateId = process.env.TEMPLATE_ID;

  if (!apiKey || !templateId) {
    return NextResponse.json({ error: 'Missing API key or template ID configuration.' }, { status: 500 });
  }

  // Construct a layers object. Each field corresponds to a text layer.
  // Make sure to use actual layer names that exist in your template.
  const payload = {
    template: templateId,
    layers: {
      "text-header-title": {
        "text": headerTitle,
        "color": "#000000"
      },
      "text-header-content": {
        "text": headerContent,
        "color": "#000000"
      },
      "text-body-title": {
        "text": bodyTitle,
        "color": "#000000"
      },
      "text-body-content": {
        "text": bodyContent,
        "color": "#000000"
      },
      "text-footer-title": {
        "text": footerTitle,
        "color": "#000000"
      },
      "text-footer-content": {
        "text": footerContent,
        "color": "#000000"
      },
      "text-audience": {
        "text": `This will be targeted towards ${audience}`,
        "color": "#000000"
      }
    }
  };

  try {
    const response = await fetch('https://api.templated.io/v1/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return NextResponse.json({ error: errorResponse.error || 'Error rendering image.' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ image_url: result.image_url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
