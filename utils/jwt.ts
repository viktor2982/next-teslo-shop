import jwt from 'jsonwebtoken';

export const signToken = ( _id: string, email: string ) => {

    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('No existe semilla de JWT - Revisar variables de entorno');
    }

    return jwt.sign(
        { _id, email }, // payload
        process.env.JWT_SECRET_SEED, // Seed
        { expiresIn: '30d' } // Options
    );

}

export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('No existe semilla de JWT - Revisar variables de entorno');
    }

    if (token.length <= 10) {
        return Promise.reject('JWT no válido');
    }

    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT no válido');

                const { _id } = payload as { _id: string };

                resolve(_id);
            });
        } catch (error) {
            reject('JWT no válido');
        }
    });
}