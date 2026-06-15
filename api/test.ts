export default async function handler(req: any, res: any) {
  return res.status(200).json({ status: 'API is working', timestamp: new Date().toISOString() });
}
