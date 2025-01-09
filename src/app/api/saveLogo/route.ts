// import { NextResponse } from 'next/server';
// import { useMutation  } from "convex/react";
// import { api } from "../../../../convex/_generated/api";

// export async function POST(request: Request) {
//     const saveLogo = useMutation(api.logo.saveLogo);

//   try {
//     const { userId, name, description, base64, styles } = await request.json();

//     if (!userId || !name || !base64) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     await saveLogo({
//       userId,
//       name,
//       description,
//       base64,
//       styles: {
//         colorPalette: styles.colorPalette || [],
//         designIdea: styles.designIdea || '',
//         theme: styles.theme || '',
//       },
//     });

//     return NextResponse.json({ message: 'Logo saved successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error saving logo:', error.response || error.message || error);
//     return NextResponse.json({ error: 'Failed to save the logo. Please try again.' }, { status: 500 });
//   }
// }
