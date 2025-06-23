// returns random savings amount -> TEST API TILL WHEN HEMANK GIVES HIS ACTUAL API
exports.mockSavings = async (req,res)=>{
  const amt = parseFloat((Math.random() * 1000).toFixed(2));
  res.json({ amount: amt });
};
