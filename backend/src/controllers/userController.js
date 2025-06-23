const { PrismaClient } = require('@prisma/client'),
      prisma = new PrismaClient(),
      { z } = require('zod');

const blSchema = z.object({
  balance: z.number(),
  dailyLimit: z.number()
});

exports.getCurrentUser = async (req,res,next)=>{
  try {
    const user = await prisma.user.findUnique({where:{id:req.user.id}});
    res.json(user);
  } catch(e){ next(e); }
};

exports.setBalanceAndLimit = async (req,res,next)=>{
  try {
    const { balance,dailyLimit } = blSchema.parse(req.body);
    const updated = await prisma.user.update({
      where:{id:req.user.id},
      data:{ balance, dailyLimit }
    });
    res.json(updated);
  } catch(e){ next(e); }
};
