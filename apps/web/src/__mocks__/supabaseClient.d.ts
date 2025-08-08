export declare const supabase: {
    auth: {
        signUp: jest.Mock<any, any, any>;
        signInWithPassword: jest.Mock<any, any, any>;
        signOut: jest.Mock<any, any, any>;
        onAuthStateChange: jest.Mock<{
            data: {
                subscription: {
                    unsubscribe: jest.Mock<any, any, any>;
                };
            };
        }, [], any>;
        getSession: jest.Mock<Promise<{
            data: {
                session: null;
            };
        }>, [], any>;
        getUser: jest.Mock<Promise<{
            data: {
                user: {
                    id: string;
                    email: string;
                };
            };
        }>, [], any>;
    };
    storage: {
        from: jest.Mock<{
            upload: jest.Mock<Promise<{
                data: {
                    path: string;
                };
                error: null;
            }>, [], any>;
            getPublicUrl: jest.Mock<{
                data: {
                    publicUrl: string;
                };
            }, [], any>;
        }, [], any>;
    };
};
//# sourceMappingURL=supabaseClient.d.ts.map