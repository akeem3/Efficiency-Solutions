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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { upsertLogisticsVehicle } from '../actions';
import { LogisticsVehicleSchema } from '../schemas';
import type { LogisticsVehicle, LogisticsCategory } from '@/generated/client';

import ImageUpload from '@/components/admin/ImageUpload';
import { LuTrash2 } from 'react-icons/lu';

type VehicleFormValues = z.infer<typeof LogisticsVehicleSchema>;

interface VehicleFormModalProps {
  vehicle?: LogisticsVehicle;
  categories: LogisticsCategory[];
  trigger?: React.ReactNode;
}

export default function VehicleFormModal({ vehicle, categories, trigger }: VehicleFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(LogisticsVehicleSchema) as any,
    defaultValues: vehicle ? {
      id: vehicle.id,
      name: vehicle.name,
      model: vehicle.model,
      description: vehicle.description,
      pricePerDay: vehicle.pricePerDay,
      category: vehicle.category,
      categoryId: vehicle.categoryId || '',
      imageUrls: vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [vehicle.imageUrl],
      features: vehicle.features,
      isFeatured: !!vehicle.isFeatured,
    } : {
      name: '',
      model: '',
      description: '',
      pricePerDay: 0,
      category: '',
      categoryId: '',
      imageUrls: [''],
      features: [],
      isFeatured: false,
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>(
    vehicle?.imageUrls && vehicle.imageUrls.length > 0 
      ? vehicle.imageUrls 
      : (vehicle?.imageUrl ? [vehicle.imageUrl] : [''])
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

  async function onSubmit(data: VehicleFormValues) {
    setLoading(true);
    try {
      const cleanedData = {
        ...data,
        imageUrls: imageUrls.filter(url => url.trim() !== '')
      };

      if (cleanedData.imageUrls.length === 0) {
        toast.error('At least one valid image URL is required');
        setLoading(false);
        return;
      }

      await upsertLogisticsVehicle(cleanedData);
      toast.success(vehicle ? 'Vehicle updated successfully' : 'Vehicle created successfully');
      setOpen(false);
      if (!vehicle) {
        form.reset();
        setImageUrls(['']);
        setFeaturesString('');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Helper to handle features input as comma-separated string
  const [featuresString, setFeaturesString] = useState(vehicle?.features.join(', ') || '');

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val && !vehicle) {
        form.reset();
        setImageUrls(['']);
        setFeaturesString('');
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
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand/Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lexus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LX 600" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Day (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                      />
                    </FormControl>                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[10px] border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                    </div>
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
              <FormLabel>Vehicle Gallery</FormLabel>
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
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AC, WiFi, Bulletproof, etc (comma separated)" 
                      value={featuresString}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeaturesString(val);
                        field.onChange(val.split(',').map(s => s.trim()).filter(Boolean));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter features separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the vehicle..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full bg-brand-primary text-white hover:bg-brand-primary/90">
                {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Create Vehicle'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
