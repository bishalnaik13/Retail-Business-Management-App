/**
 * Mock smart item suggestion function.
 * This simulates AI-based item suggestion logic.
 *
 * @param {string} shopType - Type of shop (hardware, electrical, paint)
 * @param {string} keyword - Partial item name entered by user
 * @returns {Array<string>} Suggested item names
 */

export function suggestItem(shopType, keyword){
    const mockData ={
        hardware: ['Hammer', 'Nails', 'Scrwdriver', 'Wrench', 'Drill Machines'],
        electrical: ['LED Bulb', 'Switch', 'Socket', 'Wire', 'Circuit Breaker'],
        paint: ['Emulsion Paint', 'Primer', 'Brush', 'Roller', 'Thinner']
    };

    const items = mockData[shopType] || [];
    return items.filter((item) => 
        item.toLowerCase().includes(keyword.toLowerCase())
    );
    
    /**
   * Future AI Integration (Conceptual):
   * ----------------------------------
   * This function can later be replaced with:
   * - An AI/ML model
   * - A backend API
   * - A cloud-based suggestion service
   *
   * The AI would learn from:
   * - Past invoices
   * - Frequently sold items
   * - Shop category patterns
   */
 }