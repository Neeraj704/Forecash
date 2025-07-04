const axios = require('axios');
const { ML_API_URL } = process.env;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

const txnSchema = z.object({
  amount: z.number(),
  description: z.string().optional(),
  categoryName: z.string(),
  type: z.enum(["income","expense"]),
  date: z.string().optional(),            
  initialBalance: z.number().optional()  
});

exports.createTransaction = async (req,res,next)=>{
  try {
    const { amount, description, categoryName, type, date } = txnSchema.parse(req.body);
    
    let cat = await prisma.category.findFirst({where:{ name: categoryName, userId: req.user.id }});
    if(!cat) cat = await prisma.category.create({data:{ name: categoryName, userId: req.user.id }});

    const txn = await prisma.transaction.create({
      data: {
        amount,
        description,
        type,
        date: date ? new Date(date) : undefined,
        userId: req.user.id,
        categoryId: cat.id
      }
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        balance:
          type === 'income'
            ? { increment: amount }
            : { decrement: amount }
      }
    });

    const allTxns = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'asc' },
      select: { amount: true, type: true, date: true }
    });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const payload = {
      initialBalance: user.initialBalance,
      transactions: allTxns.map(t => ({
        amount: t.amount,
        type: t.type,
        date: t.date.toISOString()
      }))
    };

    axios.post(ML_API_URL, payload).catch(err => {
      console.error('ML API error:', err.message);
    });

    res.json({ txn });
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

exports.deleteTransaction = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const txn = await prisma.transaction.delete({
      where: { id },
      select: { id: true, amount: true, type: true, userId: true }
    });
    const balanceUpdate =
      txn.type === 'expense'
        ? { increment: txn.amount }
        : { decrement: txn.amount };
    const user = await prisma.user.update({
      where: { id: txn.userId },
      data: { balance: balanceUpdate }
    });
    res.json({ message: 'Transaction deleted', balance: user.balance });
  } catch (e) {
    next(e);
  }
};
