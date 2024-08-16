'use server';

import crypto from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export async function decrypt(
  contract: { id: string, data: string, url: string },
  password: string,
) {
  const { contract_id } = await (await fetch(contract.url)).json();

  if (crypto.createHash('sha256').update(contract.data).digest('hex') !== contract_id) {
    throw new Error('Incorrect hash');
  }

  try {
    const [ivHex, encrypted] = contract.data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(password, 'salt', 32); // Derive key using scrypt
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e: any) {
    throw new Error('Incorrect password');
  }
}
