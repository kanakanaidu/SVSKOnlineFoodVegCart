import Input from "../reusables/Input";
import { Controller } from "react-hook-form";
import { CheckoutFormSchema } from "../../utils/zodSchemas";
import { Control, FieldErrors } from "react-hook-form";

type ShippingDetailsProps = {
  control: Control<CheckoutFormSchema, any>;
  errors: FieldErrors<CheckoutFormSchema>;
};

const ShippingDetails: React.FC<ShippingDetailsProps> = ({
  control,
  errors,
}) => {
  return (
    <div>
      <span className="text-lg uppercase font-semibold">Shipping Details</span>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                errorMessage={errors.firstName?.message}
                label="First Name"
                {...field}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                errorMessage={errors.lastName?.message}
                label="Last Name"
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1 relative">
              <label
                htmlFor="address"
                className="text-sm text-textColor uppercase"
              >
                Address
              </label>
              <textarea
                id="address"
                cols={30}
                rows={2}
                {...field}
                className="outline-none w-full px-2 py-1 rounded-lg border-gray-500 border-2 focus:border-primary"
              ></textarea>

              {errors.address?.message && (
                <span className="absolute -bottom-5 left-0 text-xxs sm:text-xs text-red-600">
                  {errors.address?.message}
                </span>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                errorMessage={errors.phone?.message}
                label="Phone"
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                errorMessage={errors.email?.message}
                label="Email"
                {...field}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
