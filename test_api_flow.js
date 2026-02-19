// Simulate the exact browser fetch calls

async function testFlow() {
  console.log('=== Testing API Flow ===\n');

  try {
    // 1. Test restaurants list
    console.log('1. Fetching restaurants list...');
    const restaurantsRes = await fetch('http://127.0.0.1:8000/restaurants');
    console.log('   Status:', restaurantsRes.status);
    const restaurants = await restaurantsRes.json();
    console.log('   Restaurants count:', Array.isArray(restaurants) ? restaurants.length : 'NOT AN ARRAY');
    console.log('   First restaurant:', restaurants[0]);

    // 2. Test single restaurant
    console.log('\n2. Fetching single restaurant (ID: 1)...');
    const restaurantRes = await fetch('http://127.0.0.1:8000/restaurants/1');
    console.log('   Status:', restaurantRes.status);
    const restaurant = await restaurantRes.json();
    console.log('   Restaurant name:', restaurant.name);
    console.log('   Full data:', restaurant);

    // 3. Test menu items
    console.log('\n3. Fetching menu items for restaurant 1...');
    const menuRes = await fetch('http://127.0.0.1:8000/restaurants/1/menu');
    console.log('   Status:', menuRes.status);
    const menu = await menuRes.json();
    console.log('   Menu is array?:', Array.isArray(menu));
    console.log('   Menu count:', menu.length || menu.value?.length || 'ERROR');
    console.log('   Menu items:', menu);

    console.log('\n=== All tests passed ===');
  } catch (error) {
    console.error('ERROR:', error);
  }
}

testFlow();
