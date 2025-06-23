const { PrismaClient } = require('@prisma/client'),
      prisma = new PrismaClient(),
      { z } = require('zod');

const txnSchema = z.object({
  amount: z.number(),
  description: z.string().optional(),
  categoryName: z.string()
});

exports.createTransaction = async (req,res,next)=>{
  try {
    const { amount, description, categoryName } = txnSchema.parse(req.body);

    let cat = await prisma.category.findFirst({where:{ name: categoryName, userId: req.user.id }});
    if(!cat) cat = await prisma.category.create({data:{ name: categoryName, userId: req.user.id }});

    const txn = await prisma.transaction.create({
      data:{
        amount, description,
        userId: req.user.id,
        categoryId: cat.id
      }
    });
    const user = await prisma.user.update({
      where:{id:req.user.id},
      data:{ balance: { decrement: amount } }
    });
    res.json({ txn, balance: user.balance });
  } catch(e){ next(e); }
};

exports.getTransactions = async (req,res,next)=>{
  try {
    const txns = await prisma.transaction.findMany({
      where:{ userId: req.user.id },
      orderBy:{ date:'desc' },
      include: { category: { select: { name: true } } }
    });
    res.json(txns);
  } catch(e){ next(e); }
};

exports.deleteTransaction = async (req,res,next)=>{
  try {
    const id = +req.params.id;
    const txn = await prisma.transaction.delete({where:{id}});
    // refund
    const user = await prisma.user.update({
      where:{id:txn.userId},
      data:{ balance:{ increment: txn.amount } }
    });
    res.json({message:'deleted', balance: user.balance});
  } catch(e){ next(e); }
};
