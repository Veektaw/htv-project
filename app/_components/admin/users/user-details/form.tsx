"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { Field, FieldLabel } from "@/app/_components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { languages, nameTitles } from "@/lib/constants";
import { User } from "@/types/auth";

export default function UserDetailsForm({ user }: { user: User }) {
  return (
    <Accordion type="multiple" defaultValue={["item-1"]} className="space-y-5">
      <AccordionItem value="item-1" className="space-y-3 border-none">
        <AccordionTrigger
          className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
          chevronDownClassName="size-6 text-GreyCloud"
        >
          Basic Settings
        </AccordionTrigger>

        <AccordionContent className="border-GreyCloud rounded-xls space-y-3 border px-10 py-7">
          <div className="flex items-center gap-3">
            <div className="flex w-1/2 items-center gap-3">
              <Field className="w-21.75">
                <FieldLabel htmlFor="title">Title</FieldLabel>

                <Select
                  name="title"
                  value={user.title || ""}
                  onValueChange={() => {}}
                >
                  <SelectTrigger id="title" className="min-w-full">
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {nameTitles.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input
                  id="first_name"
                  placeholder="First name"
                  value={user.first_name}
                  onChange={() => {}}
                />
              </Field>
            </div>

            <Field className="w-1/2">
              <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
              <Input
                id="last_name"
                placeholder="Last name"
                value={user.last_name}
                onChange={() => {}}
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={user.email}
                onChange={() => {}}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                placeholder="Phone"
                value={user.phone || ""}
                onChange={() => {}}
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>

              <Select name="role" value={user.role} onValueChange={() => {}}>
                <SelectTrigger id="role" className="min-w-full">
                  <SelectValue placeholder="Click to select role" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="role">Language Preference</FieldLabel>

              <Select
                name="role"
                value={user.language_pref}
                onValueChange={() => {}}
              >
                <SelectTrigger id="role" className="min-w-full">
                  <SelectValue placeholder="Click to language preference" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {languages.map((item, index) => (
                    <SelectItem key={index} value={item.type}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="space-y-3">
        <AccordionTrigger
          className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
          chevronDownClassName="size-6 text-GreyCloud"
        >
          Advanced Settings
        </AccordionTrigger>

        <AccordionContent className="border-GreyCloud rounded-xls space-y-9 border px-10 py-7">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-black">
              Platform Configuration
            </h2>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex w-1/2 items-center gap-3">
                  <Field className="w-21.75">
                    <FieldLabel htmlFor="title">Title</FieldLabel>

                    <Select
                      name="title"
                      value={user.title || ""}
                      onValueChange={() => {}}
                    >
                      <SelectTrigger id="title" className="min-w-full">
                        <SelectValue placeholder="Title" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {nameTitles.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                    <Input
                      id="first_name"
                      placeholder="First name"
                      value={user.first_name}
                      onChange={() => {}}
                    />
                  </Field>
                </div>

                <Field className="w-1/2">
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Input
                    id="last_name"
                    placeholder="Last name"
                    value={user.last_name}
                    onChange={() => {}}
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={user.email}
                    onChange={() => {}}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="Phone"
                    value={user.phone || ""}
                    onChange={() => {}}
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>

                  <Select
                    name="role"
                    value={user.role}
                    onValueChange={() => {}}
                  >
                    <SelectTrigger id="role" className="min-w-full">
                      <SelectValue placeholder="Click to select role" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="role">Language Preference</FieldLabel>

                  <Select
                    name="role"
                    value={user.language_pref}
                    onValueChange={() => {}}
                  >
                    <SelectTrigger id="role" className="min-w-full">
                      <SelectValue placeholder="Click to language preference" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {languages.map((item, index) => (
                        <SelectItem key={index} value={item.type}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
