import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId for MongoDB

// Handler for creating a new company (POST)
export async function POST(req) {
    const body = await req.json();
    
    const { name, industry, description, size } = body;

    if (!name || !industry || !description || !size) {
        return new Response(JSON.stringify({ message: "All fields are required" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const newCompany = {
            name,
            industry,
            description,
            size,
            createdAt: new Date(),
        };

        const result = await db.collection('companies').insertOne(newCompany);
        return new Response(JSON.stringify({ message: "Company created successfully", companyId: result.insertedId }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Error creating company", error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// Handler for fetching all companies (GET)
export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const companies = await db.collection('companies').find({}).toArray();
        return new Response(JSON.stringify(companies), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Error fetching companies", error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// Handler for updating a company (PUT)
export async function PUT(req) {
    const { id, name, industry, description, size } = await req.json();

    if (!id || !name || !industry || !description || !size) {
        return new Response(JSON.stringify({ message: "All fields are required" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('companies').updateOne(
            { _id: new ObjectId(id) }, // Find the company by ID
            { $set: { name, industry, description, size } } // Update the fields
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ message: "Company not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ message: "Company updated successfully" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Error updating company", error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// Handler for deleting a company (DELETE)
export async function DELETE(req) {
    const { id } = await req.json();

    if (!id) {
        return new Response(JSON.stringify({ message: "Company ID is required" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const result = await db.collection('companies').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ message: "Company not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ message: "Company deleted successfully" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Error deleting company", error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}