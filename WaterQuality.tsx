

export default function checkWaterQuality({ turbidity, ph_level, tdsValue, temperature_level }: any): number {
    console.log(`turbidity: ${turbidity}, ph_level: ${ph_level}, tdsValue: ${tdsValue}, temperature_level: ${temperature_level}`);
    
    if (
        (turbidity >= 1000 && turbidity <= 3000) ||
        (ph_level >= 0 && ph_level <= 3.99) ||
        (ph_level >= 10.01 && ph_level <= 14) ||
        (tdsValue >= 1201 && tdsValue <= 3000) ||
        temperature_level > 40.1
    ) {
        return 5;

    } else if (
        (turbidity >= 5 && turbidity <= 999) ||
        (ph_level >= 4.00 && ph_level <= 5.99) ||
        (ph_level >= 9.01 && ph_level <= 10) ||
        (tdsValue >= 301 && tdsValue <= 1200) ||
        (temperature_level >= 0 && temperature_level <= 4.99) ||
        (temperature_level >= 34.00 && temperature_level <= 40.00) 
    ) { 
        return 4;

    } else if (
        (turbidity >= 3 && turbidity <= 4) ||
        (ph_level >= 8.00 && ph_level <= 9.00) ||
        (tdsValue >= 251 && tdsValue <= 300) ||
        (tdsValue >= 0 && tdsValue <= 49) ||
        (temperature_level >= 30.1 && temperature_level <= 33.99)
    ) {
        return 3;

    } else if (
        (turbidity >= 1 && turbidity <= 2) ||
        (ph_level >= 6.00 && ph_level <= 6.99) ||
        (tdsValue >= 151 && tdsValue <= 250) ||
        (temperature_level >= 26.00 && temperature_level <= 30.00)
    ) {
        return 2;

    } else if (
        turbidity == 0 ||
        (ph_level >= 7.00 && ph_level <= 7.99) ||
        (tdsValue >= 50 && tdsValue <= 150) ||
        (temperature_level >= 5.00 && temperature_level <= 25.99)
    ) {
        return 1;

    } else {
        return 6;
    }
}