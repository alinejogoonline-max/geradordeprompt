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

            case "scenario": {
                const { environmentType, visualStyle, lighting, details } = data;

                if (!environmentType || !visualStyle || !lighting) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos obrigatórios" },
                        { status: 400 }
                    );
                }

                const scenarioPrompt = `ACT AS A PROFESSIONAL ENVIRONMENT/SCENE DESIGNER FOR AI IMAGE GENERATION.

**OBJECTIVE:** Create a highly detailed prompt for generating ONLY an environment/background scene with NO people.

**INPUT DATA:**
- Environment Type: ${environmentType}
- Visual Style: ${visualStyle}
- Lighting: ${lighting}
- Extra Details: ${details || "None"}

**TASK:**
Generate a comprehensive prompt optimized for Flux/Midjourney/Stable Diffusion.

**REQUIRED ELEMENTS:**
1. **Scene Description:** Detailed view of the ${environmentType}. Be specific about architecture, furniture, objects.
2. **Visual Style:** Apply ${visualStyle} aesthetic throughout (colors, mood, composition).
3. **Lighting:** ${lighting} - describe how light interacts with surfaces, creates shadows, highlights textures.
4. **Textures & Materials:** Specify materials (wood grain, metal finish, fabric weave, glass reflections).
5. **Color Palette:** Exact color descriptions (avoid generic "blue", use "Deep Navy" or "Powder Blue").
6. **Depth & Composition:** Foreground, midground, background elements to create depth.
7. **Atmosphere:** Mood, feeling, ambiance of the space.

**CRITICAL RULES:**
- NO people, NO human figures, NO body parts visible.
- Focus on the SPACE itself as the subject.
- High level of photorealistic detail.
- Mention camera specs: (e.g., "Shot on Sony A7R IV, 24mm wide angle, f/2.8").

**OUTPUT FORMAT:**
Provide a single, comma-separated prompt ready for image generation. No explanations, just the prompt.`;

                const result = await model.generateContent(scenarioPrompt);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "thumbnail": {
                const { expression, contentType, thumbnailText, influencerJSON, referenceImage } = data;

                if (!expression || !thumbnailText) {
                    return NextResponse.json(
                        { error: "Preencha a expressão e o texto da thumbnail" },
                        { status: 400 }
                    );
                }

                // Parse influencer data if provided
                let influencerDesc = "";
                let hasInfluencer = false;
                if (influencerJSON) {
                    try {
                        const influencerData = JSON.parse(influencerJSON);
                        const subject = influencerData.subject;
                        influencerDesc = `Specific person: ${subject.gender}, ${subject.age} years old, ${subject.ethnicity}, ${subject.hair?.color || 'styled'} hair, ${subject.eyes?.color || 'expressive'} eyes.`;
                        hasInfluencer = true;
                    } catch (e) {
                        console.log("Invalid influencer JSON, using generic model");
                    }
                }

                // Add reference image if provided
                if (referenceImage) {
                    imageParts.push(fileToGenerativePart(referenceImage, "image/jpeg"));
                }

                // Expression mapping
                const expressionDetails: Record<string, string> = {
                    shocked: "Wide open mouth, raised eyebrows, eyes fully open showing whites, hands on cheeks (Home Alone pose)",
                    amazed: "Sparkling eyes, slight smile, eyebrows raised in wonder, leaning forward",
                    mindblown: "Head tilted back, mouth open in awe, both hands on head, eyes wide",
                    determined: "Intense eye contact, jaw clenched, eyebrows furrowed, confident posture",
                    emotional: "Glassy eyes, soft smile or slight frown, hand on heart, vulnerable expression",
                    smirk: "Half smile, one eyebrow raised, knowing look, arms crossed confidently",
                    excited: "Huge smile, eyes sparkling, possibly jumping or energetic pose",
                    skeptical: "One eyebrow raised, slight frown, arms crossed, judging look",
                    laughing: "Big genuine laugh, eyes squinted, head thrown back, mouth wide open",
                    serious: "Stern face, direct eye contact, no smile, focused intense stare"
                };

                const expressionDetail = expressionDetails[expression] || "Expressive face";

                const thumbnailPrompt = imageParts.length > 0
                    ? `Analyze this reference image and create a thumbnail prompt matching this expression.

**THUMBNAIL SPECS:**
- Expression: ${expressionDetail}
- Content Type: ${contentType}
- Text Overlay: "${thumbnailText}"
${hasInfluencer ? `- Subject: ${influencerDesc}` : "- Subject: Attractive content creator"}

Create a prompt for a HIGH-CTR YouTube/TikTok thumbnail following these rules:
1. EXTREME CLOSE-UP of face (face fills 70% of frame)
2. Crystal clear expression matching the reference
3. High contrast, vibrant saturation
4. Background: Blurred or simple gradient
5. Perfect lighting on face (no harsh shadows)
6. Text space reserved on thirds
7. 16:9 aspect ratio, 1920x1080px

Output format: Detailed prompt for thumbnail generation.`
                    : `ACT AS A VIRAL THUMBNAIL DESIGNER.

**OBJECTIVE:** Create a prompt for a HIGH-CTR YouTube/TikTok thumbnail.

**SPECS:**
- Expression: ${expressionDetail}
- Content Type: ${contentType}
- Text Overlay: "${thumbnailText}"
${hasInfluencer ? `- Subject: ${influencerDesc}` : "- Subject: Attractive content creator (neutral ethnicity, 25-30 years old)"}

**THUMBNAIL REQUIREMENTS:**
1. **Framing:** EXTREME close-up portrait. Face fills 70% of the frame. Direct eye contact with camera.
2. **Expression:** ${expressionDetail}. Make it EXAGGERATED and CLEAR from a distance.
3. **Lighting:** Ring light or 3-point studio lighting. Face must be brightly lit, no harsh shadows.
4. **Colors:** High saturation, high contrast. Pop off the screen.
5. **Background:** Simple blurred background or solid gradient. Don't compete with face.
6. **Text Space:** Leave clear space on top or bottom third for text overlay: "${thumbnailText}"
7. **Quality:** 16:9 aspect ratio, 1920x1080px, hyper-realistic, sharp focus on eyes.
8. **Emotion Clarity:** The ${expression} expression must be instantly readable even at small size.

**NEGATIVE PROMPT:**
Low contrast, dim lighting, blurry, multiple people, cluttered background, face too small, generic expression.

**OUTPUT:**
Provide a single detailed prompt optimized for Midjourney/Flux/DALL-E 3 for thumbnail generation. Comma-separated format.`;

                const promptToUse = imageParts.length > 0
                    ? [thumbnailPrompt, ...imageParts]
                    : thumbnailPrompt;

                const result = await model.generateContent(promptToUse);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "pets": {
                const { petType, breed, action, scenario, personality, petPhoto, details } = data;

                if (!petType || !breed) {
                    return NextResponse.json(
                        { error: "Preencha o tipo de pet e a raça/descrição" },
                        { status: 400 }
                    );
                }

                // Add pet photo if provided
                if (petPhoto) {
                    imageParts.push(fileToGenerativePart(petPhoto, "image/jpeg"));
                }

                // Personality-based styling
                const personalityStyles: Record<string, { mood: string; camera: string; lighting: string }> = {
                    cute: { mood: "Heartwarming, adorable", camera: "Slightly from above (cute angle)", lighting: "Soft, flattering natural light" },
                    funny: { mood: "Comedic, meme-worthy", camera: "Unexpected angle or close-up", lighting: "Bright, clear" },
                    elegant: { mood: "Sophisticated, regal", camera: "Eye level, portrait style", lighting: "Studio lighting, dramatic" },
                    energetic: { mood: "Dynamic, action-packed", camera: "Fast shutter, motion blur acceptable", lighting: "Bright, vibrant" },
                    lazy: { mood: "Chill, relaxed vibes", camera: "Wide shot showing comfortable position", lighting: "Warm, cozy afternoon light" },
                    curious: { mood: "Inquisitive, exploratory", camera: "Close-up on eyes/face", lighting: "Natural, clear" },
                    dramatic: { mood: "Over-the-top, theatrical", camera: "Low angle for grandeur", lighting: "Cinematic, high contrast" },
                    sassy: { mood: "Attitude, sass", camera: "Side eye angle", lighting: "Bold, confident" },
                    majestic: { mood: "Epic, powerful", camera: "Low angle hero shot", lighting: "Golden hour, backlit" },
                    derpy: { mood: "Goofy, silly", camera: "Weird angle, tongue out", lighting: "Fun, unstaged" }
                };

                const currentPersonality = personalityStyles[personality] || personalityStyles.cute;

                const petsPrompt = imageParts.length > 0
                    ? `Analyze this pet photo and create a viral TikTok/Instagram prompt.

**PET SPECS:**
- Type: ${petType}
- Breed/Description: ${breed}
- Action: ${action}
- Scenario: ${scenario}
- Personality: ${personality} (${currentPersonality.mood})
${details ? `- Extra Details: ${details}` : ""}

**REQUIREMENTS:**
1. Analyze the photo to capture the pet's unique features
2. ${currentPersonality.camera}
3. Lighting: ${currentPersonality.lighting}
4. Focus on cuteness/viral factors (big eyes, fluffy fur, adorable expression)
5. Natural pet behavior, realistic poses
6. High-quality photography: Sony A7III, 50mm f/1.8

**OUTPUT:** Detailed prompt for generating this pet in the specified action/scenario, matching the photo's characteristics.`
                    : `ACT AS A VIRAL PET CONTENT CREATOR.

**OBJECTIVE:** Create a prompt for generating adorable, shareable pet content for TikTok/Instagram.

**PET DETAILS:**
- Type: ${petType}
- Breed/Description: ${breed}
- Action: ${action}
- Scenario: ${scenario}
- Personality/Vibe: ${personality}
${details ? `- Extra Details: ${details}` : ""}

**PROMPT REQUIREMENTS:**

1. **Pet Description:**
   - Specific breed characteristics (${breed})
   - Adorable features (big expressive eyes, fluffy fur/feathers, cute nose/mouth)
   - Natural, healthy appearance
   - Age-appropriate look (puppy/kitten vs adult)

2. **Action/Pose:**
   - Engaged in: ${action}
   - Natural pet behavior (no forced/uncomfortable poses)
   - Capture the ${personality} personality

3. **Environment:**
   - Setting: ${scenario}
   - Background should complement but not distract from pet
   - Appropriate props if relevant to action

4. **Photography Specs:**
   - Camera: ${currentPersonality.camera}
   - Lighting: ${currentPersonality.lighting}
   - Quality: High-resolution, sharp focus on pet's eyes
   - Mood: ${currentPersonality.mood}
   - Sensor: Pet portrait specialist camera (Sony A7 series, 50mm or 85mm lens)

5. **Viral Factors:**
   - Maximize "aww factor"
   - Relatable pet moments
   - Shareable/meme potential
   - Clear emotional connection

**NEGATIVE PROMPT:**
Deformed animals, extra limbs, unnatural anatomy, sad/sick appearance, scary, aggressive, poor lighting, blurry, low quality, watermark.

**OUTPUT:**
Single detailed prompt optimized for Flux/Midjourney/DALL-E 3. Comma-separated format.`;

                const promptToUse = imageParts.length > 0
                    ? [petsPrompt, ...imageParts]
                    : petsPrompt;

                const result = await model.generateContent(promptToUse);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
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
