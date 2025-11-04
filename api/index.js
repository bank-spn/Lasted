// Vercel Serverless Function
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'SPN rOS API',
    timestamp: new Date().toISOString()
  });
}
