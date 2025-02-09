import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit, Book } from 'lucide-react';
import { authOptions } from '@/app/api/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';


export default async function Add() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return <div className="text-center text-red-500">Acesso negado</div>;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! }
    });

    if (!user) {
        return <div className="text-center text-red-500">Usuário não encontrado</div>;
    }

    const ebooks = await prisma.pLR.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });


    //   URL
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Meus Ebooks</h1>
                <Link href="/dashboard/products/ebook/create" className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-600/10 hover:text-blue-600 flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Criar Ebook
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ebooks.length > 0 ? (
                    ebooks.map((ebook) => (
                        <div key={ebook.id} className="bg-white rounded-lg    relative">
                            <div className="w-full h-48 relative mb-4 overflow-hidden rounded-md">
                                {/* Etiqueta de "eBook" */}
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 z-50 rounded-md flex items-center gap-1">
                                    <Book className="w-4 h-4 text-white" /> eBook
                                </div>

                                {/* Imagem do eBook */}
                                {ebook.thumbnailUrl ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${ebook.thumbnailUrl}`}
                                        alt={ebook.title}
                                        fill
                                        className="object-cover rounded-none "
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ">
                                        <Book className="w-16 h-16 text-white opacity-75" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">{ebook.title}</h3>
                            <p className="text-gray-600 mb-4">{ebook.description}</p>

                            <div>
                                <Link href={`/dashboard/products/ebook/edit/${ebook.id}`} className="text-blue-500 hover:text-blue-700">
                                    <Edit className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhum ebook encontrado.</p>
                )}
            </div>
        </div>
    );
}
