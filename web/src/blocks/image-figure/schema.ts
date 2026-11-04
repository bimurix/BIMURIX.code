import { defineField, defineType } from "sanity";

export const imageFigure = defineType({
  name: "imageFigure",
  title: "Image",
  type: "object",
  fields: [
    defineField({ name: "image", title: "Image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Légende", type: "localeString" }),
  ],
  preview: {
    select: { title: "caption.fr", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Image", media }),
  },
});
