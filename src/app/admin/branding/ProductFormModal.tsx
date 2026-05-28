'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { upsertBrandingProduct } from '../actions';
import { BrandingProductSchema } from '../schemas';
import type { BrandingProduct, BrandingCategory } from '@/generated/client';
import ImageUpload from '@/components/admin/ImageUpload';
import { LuTrash2 } from 'react-icons/lu';
import { cn } from '@/lib/utils';

type ProductFormValues = z.infer<typeof BrandingProductSchema>;

interface ProductFormModalProps {
  product?: BrandingProduct;
  categories: BrandingCategory[];
  trigger?: React.ReactNode;
}

export default function ProductFormModal({ product, categories, trigger }: ProductFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(BrandingProductSchema) as any,
    defaultValues: product ? {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price || 0,
      category: product.category,
      categoryId: product.categoryId || '',
      imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl],
      isFeatured: !!product.isFeatured,
    } : {
      name: '',
      description: '',
      price: 0,
      category: '',
      categoryId: '',
      imageUrls: [''],
      isFeatured: false,
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls 
      : (product?.imageUrl ? [product.imageUrl] : [''])
  );

  const addImageField = () => setImageUrls([...imageUrls, '']);
  const removeImageField = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length ? newUrls : ['']);
    form.setValue('imageUrls', newUrls.length ? newUrls : ['']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    form.setValue('imageUrls', newUrls);
  };

  async function onSubmit(data: ProductFormValues) {
    setLoading(true);
    try {
      // Clean up empty URLs
      const cleanedData = {
        ...data,
        imageUrls: imageUrls.filter(url => url.trim() !== ''),
        price: null // Force null for branding
      };
      
      if (cleanedData.imageUrls.length === 0) {
        toast.error('At least one valid image URL is required');
        setLoading(false);
        return;
      }

      await upsertBrandingProduct(cleanedData);
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      setOpen(false);
      if (!product) {
        form.reset();
        setImageUrls(['']);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val && !product) {
        form.reset();
        setImageUrls(['']);
      }
    }}>
      <DialogTrigger 
        render={(props) => 
          trigger ? (
            React.cloneElement(trigger as React.ReactElement, props)
          ) : (
            <button 
              {...props} 
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Edit
            </button>
          )
        } 
      />
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Classic T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        const catName = categories.find(c => c.id === val)?.name || '';
                        form.setValue('category', catName);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[10px] border p-3 shadow-sm h-10 mt-8">
                    <FormLabel className="text-xs">Featured</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Product Gallery</FormLabel>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1">
                    <ImageUpload
                      label={`Image ${index + 1}`}
                      currentImage={url || undefined}
                      onUploadSuccess={(newUrl) => handleImageUrlChange(index, newUrl)}
                    />
                  </div>
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 mt-7 text-destructive"
                      onClick={() => removeImageField(index)}
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={addImageField}
              >
                + Add Another Image
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the product..." 
                      className="resize-none h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="submit" disabled={loading} className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
                {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
}
