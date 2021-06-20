import bcrypt from 'bcrypt';

const rounds = 10;

export async function encrypt(str: string): Promise<string> {
  let hashedStr = null;

  await bcrypt.hash(str, rounds).then(hash => {
    hashedStr = hash;
  });

  if (!hashedStr) {
    throw Error('hash error');
  }

  return hashedStr;
}

export async function compare(
  hashedStr: string,
  str: string,
): Promise<boolean> {
  return bcrypt.compare(str, hashedStr);
}
