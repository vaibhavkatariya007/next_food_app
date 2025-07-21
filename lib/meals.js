import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
// import { S3 } from "@aws-sdk/client-s3";

// const s3 = new S3({
//   region: "us-east-1",
// });

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
}

export async function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  // meal.slug = meal.title.replace(/ /g, "-").toLowerCase();
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  // s3.putObject({
  //   Bucket: "maxschwarzmueller-nextjs-demo-users-image",
  //   Key: fileName,
  //   Body: Buffer.from(bufferedImage),
  //   ContentType: meal.image.type,
  // });

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed");
    }
  });
  meal.image = `/images/${fileName}`;
  //meal.image = fileName;

  db.prepare(
    `
    INSERT INTO meals
      (title, slug, image, summary, instructions, creator, creator_email)
    VALUES (
      @title,
      @slug,
      @image,
      @summary,
      @instructions,
      @creator,
      @creator_email
    )
  `
  ).run(meal);
}

// File path: /Users/vaibhavkatariya/Desktop/Workspaces/food_app/initdb.js
// Content:
//initData();
