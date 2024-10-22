
const express = require('express')
const cors = require('cors')
const app = express();
const port = 3000;
const {getCalorieCalculationOutput} = require('./calorieCalculator')
app.use(cors());
app.use(express.json())

app.post('/calculate', async (req, res) => {
    const { meals, personalInfo } = req.body;
    const {calorieCountFromFood,requiredCalorie} = await getCalorieCalculationOutput(meals,personalInfo)
    res.status(200).json({ calorieCountFromFood, requiredCalorie })
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
