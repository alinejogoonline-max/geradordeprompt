import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function to convert base64 to Gemini format
function fileToGenerativePart(base64Data: string, mimeType: string) {
    return {
        inlineData: {
            data: base64Data.split(',')[1], // Remove data:image/xxx;base64, prefix
            mimeType,
        },
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tabType, influencerData, ...data } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Chave API do Gemini não configurada" },
                { status: 500 }
            );
        }

        // Initialize the model (using Gemini 2.5 Flash as explicitly requested)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = "";
        let imageParts = [];
        let finalPrompt = "";

        // Handle different tab types
        switch (tabType) {
            case "influencer": {
                const { gender, age, ethnicity, hairColor, eyeColor, location, extraDetails, referencePhoto } = data;

                if (!gender || !age || !ethnicity || !hairColor || !eyeColor) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos obrigatórios" },
                        { status: 400 }
                    );
                }

                // Generate high-fidelity JSON via Gemini to ensure translation and stereotype breaking
                const influencerPrompt = `
                ACT AS A WORLD-CLASS AI PROMPT ENGINEER.
                Create a high-fidelity JSON profile for an influencer.

                **INPUT DATA:**
                - Gender: ${gender}
                - Age: ${age}
                - Ethnicity: ${ethnicity}
                - Hair: ${hairColor} (CRITICAL: Enforce this strictly. If "Loira" or "Blonde" with Asian ethnicity, FORCE "Dyed Blonde" or "Platinum Blonde")
                - Eyes: ${eyeColor}
                - Location/Setting: ${location || "random"} (If "random", choose an appropriate location. Otherwise translate to English, e.g., "cafe" -> "Coffee Shop Interior", "praia" -> "Beach", "casa" -> "Cozy Home Interior")
                - Extra Details: ${extraDetails || "None"}
                - Reference Photo Provided: ${referencePhoto ? "Yes" : "No"}

                **TASK:**
                Generate a JSON object compatible with Flux/Midjourney logic.
                Translate all Portuguese inputs to English specifically for image generation (e.g., "Morena" -> "Brown Hair", "Loira" -> "Blonde").

                **JSON STRUCTURE:**
                {
                    "image_type": "portrait",
                    "style": "high-end lifestyle photography",
                    "realism_level": "hyper realistic 8k",
                    "subject": {
                        "gender": "...",
                        "age": "...",
                        "ethnicity": "...",
                        "features_description": "...",
                        "hair": {
                            "color": "...",
                            "style": "stylish modern cut",
                            "physics": "natural flow",
                            "texture": "individual strands visible"
                        },
                        "eyes": {
                            "color": "...",
                            "style": "sharp focus, reflections of ring light"
                        },
                        "skin_texture": {
                            "style": "raw photography",
                            "details": ["visible pores", "micro-imperfections", "subsurface scattering"]
                        },
                        "face": {
                            "proportions": "golden ratio",
                            "expression": "approachable soft confidence"
                        },
                        // Add makeup if female, grooming if male
                    },
                    "environment": {
                        "background": "... (Use the Location/Setting input to determine the background scene. Be specific and descriptive)",
                        "lighting": {
                            "type": "Rembrandt lighting",
                            "style": "cinematic softbox (adjust based on location - e.g., natural sunlight for beach, warm interior lights for cafe)"
                        }
                    },
                    "camera": {
                        "sensor": "Sony A7R IV",
                        "lens": "85mm G Master",
                        "quality": "raw photo"
                    }
                }

                **IMPORTANT:**
                - JSON ONLY. No markdown, no intro.
                - Enforce the HAIR COLOR provided in the input, even if it contradicts the ethnicity stereotype (e.g., Asian + Blonde).
                `;

                const result = await model.generateContent(influencerPrompt);
                let responseText = result.response.text();

                // Clean up potential markdown formatting
                responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

                try {
                    // Verify if it's valid JSON
                    JSON.parse(responseText);
                    return NextResponse.json({ prompt: responseText });
                } catch (e) {
                    console.error("Gemini generated invalid JSON for influencer", e);
                    // Fallback to manual if AI fails
                    const influencerJSON = {
                        subject: {
                            gender, age, ethnicity, hair: { color: hairColor }
                        }
                    }
                    return NextResponse.json({ prompt: JSON.stringify(influencerJSON, null, 2) });
                }
            }

            case "script": {
                const { productName, mainBenefit, tone } = data;

                if (!productName || !mainBenefit) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos do roteiro" },
                        { status: 400 }
                    );
                }

                const toneInstructions: Record<string, string> = {
                    energetic: "⚡ Vibe: Cortada, rápida, alta energia, emojis, foco em retenção.",
                    professional: "🎓 Vibe: Autoridade, séria, limpa, foco em fatos e resultados.",
                    humorous: "😂 Vibe: Irônica, leve, usa gírias de internet, meme-style.",
                    emotional: "💖 Vibe: Contação de história (storytelling), música triste/inspiradora de fundo.",
                    urgent: "🚨 Vibe: Escassez, promoção relâmpago, 'só hoje', gatilho de perda.",
                    asmr: "🌿 Vibe: Sussurrada, sons satisfatórios, calma, 'satisfying'."
                };

                const selectedTone = toneInstructions[tone || "energetic"];

                const scriptPrompt = `ACT AS A WORLD-CLASS TIKTOK SCRIPTWRITER.

**OBJECTIVE:** Create 3 VIRAL scripts for:
- Product: "${productName}"
- Benefit: "${mainBenefit}"
- Tone: ${selectedTone}

**RULES:**
1. Hooks MUST be under 3 seconds.
2. Use "YOU" language (fale diretamente com o usuário).
3. Native Brazilian Portuguese (Gírias naturais, nada de 'português traduzido').
4. NO corporate speak. Use generic internet slang.

**FORMAT (STRICTLY FOLLOW THIS):**

**OPTION 1: THE PATTERN INTERRUPT (Visual Hook)**
[Scene]: (Describe a visually weird or satisfying action to stop scrolling)
[Text Overlay]: (Short impactful text)
[Audio]: "(Script in PT-BR)"

---

**OPTION 2: THE SECRET/HACK (Curiosity Hook)**
[Scene]: (Whispering to camera or showing a hidden detail)
[Text Overlay]: "Não conte pra ninguém..."
[Audio]: "(Script in PT-BR)"

---

**OPTION 3: THE DRAMATIC PROBLEM (Relatable Hook)**
[Scene]: (Person looking frustrated/sad with the 'old way')
[Text Overlay]: "Cansada de...?"
[Audio]: "(Script in PT-BR)"`;

                const result = await model.generateContent(scriptPrompt);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "fashion": {
                const { image, mediaType, influencerJSON, customScript, tone } = data;

                if (!image) {
                    return NextResponse.json(
                        { error: "Faça o upload da roupa" },
                        { status: 400 }
                    );
                }

                imageParts.push(fileToGenerativePart(image, "image/jpeg"));

                const visionPrompt = `Analyze this outfit for a Generative AI prompt. Focus on VISUAL FIDELITY.
Describe:
1. The Garment: Exact cut, length, neckline, sleeve style.
2. Fabric Physics: Weight (heavy/light), texture (satin/knit/denim), how it reflects light.
3. Colors/Patterns: Specific hex-code vibes (e.g. "Pastel Sage Green" instead of "Green").
4. Fit: Oversized, bodycon, tailored?

Output ONLY the description. No intro.`;

                const visionResult = await model.generateContent([visionPrompt, ...imageParts]);
                const clothingDescription = visionResult.response.text();

                let influencerDesc = "";
                let hasInfluencer = false;
                if (influencerJSON) {
                    try {
                        const influencerData = JSON.parse(influencerJSON);
                        const subject = influencerData.subject;
                        influencerDesc = `(${subject.gender}, ${subject.age}y, ${subject.ethnicity}, ${subject.hair.color} ${subject.hair.style}, ${subject.eyes.color} eyes, ${subject.body_type} body).`;
                        hasInfluencer = true;
                    } catch (e) {
                        console.log("Invalid influencer JSON");
                    }
                }

                // Advanced Tone Mapping for Visuals
                const toneVisuals: Record<string, { lighting: string; camera: string; vibe: string; scriptStyle: string }> = {
                    energetic: {
                        lighting: "High-key, bright sunlight, vibrant saturation",
                        camera: "Dynamic movement, slight handheld shake for realism, fast cuts",
                        vibe: "Trendy, Pop, TikTok Viral",
                        scriptStyle: "Excited and fast"
                    },
                    professional: {
                        lighting: "Soft studio 3-point lighting, clean white balance",
                        camera: "Stable tripod shot, slow cinematic dolly push",
                        vibe: "Luxury, E-commerce, Clean Girl Aesthetic",
                        scriptStyle: "Educational and calm"
                    },
                    humorous: {
                        lighting: "Natural everyday lighting, slightly unpolished",
                        camera: "Front camera selfie angle (fisheye distortion effect), handheld",
                        vibe: "Relatable, Casual, Meme-ready",
                        scriptStyle: "Funny and casual"
                    },
                    emotional: {
                        lighting: "Golden hour (warm sunset), lens flares, soft contrast",
                        camera: "Slow motion (60fps), tight close-ups on details",
                        vibe: "Cinematic, Dreamy, Inspiring",
                        scriptStyle: "Soft and storytelling"
                    },
                    urgent: {
                        lighting: "Contrast heavy, neon accents, flashing effect",
                        camera: "Snap zooms, erratic movement",
                        vibe: "Sale, FOMO, Breaking News",
                        scriptStyle: "Fast and loud"
                    },
                    asmr: {
                        lighting: "Dim, cozy warm light (2700K), soft shadows",
                        camera: "Macro lens, extremely stable, very slow movement",
                        vibe: "Cozy, Sensory, Texture-focused",
                        scriptStyle: "Whispered"
                    }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Create a ${currentTone.scriptStyle} script in PT-BR about this look)`;

                if (mediaType === "photo") {
                    finalPrompt = `**PROMPT FOR FLUX/MIDJOURNEY V6 (REALISM MODE)**

**SUBJECT:**
Beautiful influencer ${influencerDesc} wearing:
${clothingDescription}

**ENVIRONMENT & LIGHTING:**
- Location: Modern luxury boutique fitting room.
- Lighting: ${currentTone.lighting}.
- Atmosphere: ${currentTone.vibe}.

**PHOTOGRAPHY SPECS:**
- Camera: Sony A7R V, 35mm f/1.4 GM Lens.
- Quality: 8k, Raw Photo, Hyper-detailed skin texture (pores, vellus hair), Ray-traced reflections.
- Framing: Full body mirror selfie (Mirror reflection visible).
- Style: Influencer Instagram Story aesthetic.`;
                } else {
                    finalPrompt = `**VIDEO PROMPT (KLING/LUMA/RUNWAY/FLOW)**

**KEYFRAMES:**
1. Start: Influencer stands in front of mirror, phone covering face slightly.
2. Action: She lowers phone to chest level, does the "fit check" spin (30 degrees).
3. Physics: ${clothingDescription} moves naturally. Pay attention to fabric weight.

**CHARACTER:**
${hasInfluencer ? `STRICT FACE CONSISTENCY: ${influencerDesc}` : "A stylish fashion influencer."}

**CINEMATOGRAPHY:**
- Camera Movement: ${currentTone.camera}.
- Lighting: ${currentTone.lighting}.
- Color Grade: ${currentTone.vibe}.

**AUDIO SCRIPT (PT-BR):**
${audioScript}

**NEGATIVE PROMPT:**
Morphing, melting hands, text glitches, extra fingers, cartoon, drawing, painting, bad physics.`;
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            case "pov": {
                const { image: productImage, mediaType, customScript, tone } = data;

                if (!productImage) {
                    return NextResponse.json(
                        { error: "Faça o upload da imagem do produto" },
                        { status: 400 }
                    );
                }

                // Add image for Gemini Vision
                imageParts.push(fileToGenerativePart(productImage, "image/jpeg"));

                // Ask Gemini to describe the product
                const productVisionPrompt = `Describe this product for a video generation prompt.
Focus on:
1. OBJECT PERMANENCE: Exact text on labels, logo placement, specific colors.
2. MATERIAL: Glass reflection, plastic matte, paper texture?
3. SHAPE: Bottle, Box, Tube?

Write a dense, comma-separated description.`;

                const productResult = await model.generateContent([productVisionPrompt, ...imageParts]);
                const productDescription = productResult.response.text();

                // Tone Mapping for POV
                const toneVisuals: Record<string, { lighting: string; movement: string; audioType: string }> = {
                    energetic: { lighting: "Daylight, bright window", movement: "Quick unboxing, fast hands", audioType: "Excited" },
                    professional: { lighting: "Studio softbox", movement: "Precise, slow handling", audioType: "Educational" },
                    humorous: { lighting: "Home living room", movement: "Casual, maybe a bit clumsy/real", audioType: "Funny" },
                    emotional: { lighting: "Warm lamp, evening", movement: "Gentle caress of packaging", audioType: "Grateful" },
                    urgent: { lighting: "Bright, high contrast", movement: "Rushed, bringing close to camera", audioType: "Urgent" },
                    asmr: { lighting: "Dark room, RGB accent", movement: "Tapping, scratching, slow rotation", audioType: "Whisper" }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Write a ${currentTone.audioType} mini-review in PT-BR)`;

                if (mediaType === "photo") {
                    finalPrompt = `**MACRO POV PHOTOGRAPHY**

**SUBJECT:**
First-person view (POV) of a hand holding: ${productDescription}.

**FIDELITY CHECK:**
- The product MUST match the description 100%. No hallucinated text.
- Label text must be legible and sharp.

**HAND DETAILS:**
- Skin texture: Hyper-realistic, visible knuckles and veins.
- Nails: Manicured, natural look.

**SCENE:**
- Lighting: ${currentTone.lighting}.
- Background: High quality gaussian blur (Bokeh). Focus solely on product.
- Lens: 105mm Macro f/2.8.`;
                } else {
                    finalPrompt = `**VIDEO PROMPT (POV UNBOXING - FLOW/KLING)**

**SCENE:**
First-person view (POV). A realistic hand holding: ${productDescription}.

**ACTION:**
${currentTone.movement}. The hand rotates the product to show the label, then tilts it to show the texture/cap.

**TECHNICAL:**
- Stabilization: Cinematic Gimbal (No shaky cam unless intended).
- Lighting: ${currentTone.lighting}.
- Focus: Rack focus on the product label.

**AUDIO (PT-BR):**
${audioScript}

**SAFETY:**
NO morphing labels. NO melting fingers. The product must remain solid rigid object.

**NEGATIVE PROMPT:**
Morphing, melting hands, text glitches, extra fingers, cartoon, drawing, painting, bad physics, low resolution, blurry.`;
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            case "showcase": {
                const { productImage, mediaType, influencerJSON, customScript, tone } = data;

                if (!productImage) {
                    return NextResponse.json(
                        { error: "Faça o upload do produto" },
                        { status: 400 }
                    );
                }

                // Add product image for Gemini Vision
                imageParts.push(fileToGenerativePart(productImage, "image/jpeg"));

                const productPrompt = `Analyze this product image.
Output a comma-separated description focusing on:
1. PRODUCT TYPE (Bottle, Box, Jar, Device)
2. BRAND COLORS (Exact hex vibes)
3. MATERIAL (Matte plastic, clear glass, metallic)
4. LABEL TEXT (What is written on it?)`;
                const productResult = await model.generateContent([productPrompt, ...imageParts]);
                const productDesc = productResult.response.text();

                let influencerDesc = "";
                let hasInfluencer = false;
                if (influencerJSON) {
                    try {
                        const influencerData = JSON.parse(influencerJSON);
                        const subject = influencerData.subject;
                        influencerDesc = `(${subject.gender}, ${subject.age}y, ${subject.ethnicity}, ${subject.hair.color}, ${subject.eyes.color} eyes)`;
                        hasInfluencer = true;
                    } catch (e) {
                        console.log("Invalid JSON");
                    }
                }

                // Tone Mapping for Showcase
                const toneVisuals: Record<string, { mood: string; expression: string; audio: string }> = {
                    energetic: { mood: "Vibrant, Pop Art", expression: "Wide smile, surprised eyes (Pog face)", audio: "Shocked" },
                    professional: { mood: "Clean, Clinical, White", expression: "Confident, soft smile", audio: "Expert" },
                    humorous: { mood: "Playful, Colorful", expression: "Winking or making a funny face", audio: "Joking" },
                    emotional: { mood: "Warm, Golden, Cozy", expression: "Soft smile, looking lovingly at product", audio: "Loving" },
                    urgent: { mood: "Intense, High Contrast", expression: "Serious, pointing urgently", audio: "Warning" },
                    asmr: { mood: "Dim, Bedroom, RGB", expression: "Relaxed, closed eyes smell test", audio: "Soft" }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Write a ${currentTone.audio} reaction in PT-BR)`;

                if (mediaType === "photo") {
                    finalPrompt = `**BEAUTY/LIFESTYLE PORTRAIT**

**SUBJECT:**
${hasInfluencer ? `Specific Influencer: ${influencerDesc}` : "A stunning model"}
Holding product: ${productDesc}.

**POSE:**
- Product Placement: Held next to face/cheek (Beauty Youtuber Thumbnail style).
- Label Visibility: 100% visible to camera.
- Expression: ${currentTone.expression}.

**AESTHETIC:**
- Lighting: Ring Light + Softbox (E-commerce standard).
- Mood: ${currentTone.mood}.
- Camera: Canon R5, 85mm f/1.2 Portrait Lens.
- Quality: Magazine retouching, sharp eyes, readable product label.`;
                } else {
                    finalPrompt = `**VIDEO PROMPT (TESTIMONIAL - FLOW/KLING)**

**CHARACTER:**
${hasInfluencer ? influencerDesc : "Influencer"} reviewing a product.

**ACTION:**
1. Influencer defines ${currentTone.expression}.
2. Holds ${productDesc} up to the camera lens (Macro shot).
3. Pulls back and points to the product.

**ATMOSPHERE:**
- Mood: ${currentTone.mood}.
- Background: Aesthetic bedroom or studio.

**AUDIO (PT-BR):**
${audioScript}

**TECH SPECS:**
- 4k Resolution.
- No hand clipping.
- Accurate product scale.

**NEGATIVE PROMPT:**
Morphing, melting hands, text glitches, extra fingers, cartoon, drawing, painting, bad physics, distorted face.`;
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            default:
                return NextResponse.json(
                    { error: "Tipo de tab inválido" },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error("Erro ao gerar prompt:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao gerar prompt" },
            { status: 500 }
        );
    }
}
