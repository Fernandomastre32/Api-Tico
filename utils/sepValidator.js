export const verificarCedulaSEP = async (cedula) => {
    if (!cedula) return false;

    try {
        const response = await fetch('https://www.cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                maxResult: "10",
                nombre: "",
                paterno: "",
                materno: "",
                idCedula: cedula
            })
        });

        const data = await response.json();

        if (data && data.items && data.items.length > 0) {
            const match = data.items.find(item => item.idCedula == cedula);
            if (match) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('[SEP VALIDATOR ERROR]', error.message);
        // Si hay error en la API externa, no bloqueamos totalmente pero la marcamos como no verificada
        return false;
    }
};
