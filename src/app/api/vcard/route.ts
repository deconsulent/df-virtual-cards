import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new NextResponse('Username is required', { status: 400 });
  }

  // Fetch the user and skills for the vCard
  const { data: user, error: userError } = await supabase.from('users').select('*').eq('username', username).single();
  
  if (userError || !user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const { data: skills } = await supabase.from('skills').select('name').eq('user_id', user.id);
  const skillList = skills?.map(s => s.name).join(', ') || '';

  // Construct vCard string
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${user.name};;;;
FN:${user.name}
ORG:Riga Technical University Design Factory
TITLE:${user.role}
EMAIL;type=INTERNET;type=WORK;type=pref:${user.email}
URL:${user.linkedin || ''}
URL;type=CALENDLY:${user.calendly || ''}
NOTE:Superpower: ${user.superpower || ''} | Skills: ${skillList}
END:VCARD`;

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': `attachment; filename="${user.username}.vcf"`,
    },
  });
}
