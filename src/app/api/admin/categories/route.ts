import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/db';
import { createSecureResponse } from '@/lib/security';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        await deleteCategory(category);
        return createSecureResponse({ success: true, message: `Category '${category}' deleted` });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
