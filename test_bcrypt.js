import bcrypt from 'bcryptjs';

async function test() {
    try {
        await bcrypt.compare('1234', null);
        console.log('Null worked');
    } catch (e) {
        console.log('Null threw error:', e.message);
    }
    try {
        await bcrypt.compare('1234', undefined);
        console.log('Undefined worked');
    } catch (e) {
        console.log('Undefined threw error:', e.message);
    }
}
test();
