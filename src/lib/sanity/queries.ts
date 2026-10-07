import { defineQuery } from "next-sanity";
export const SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]{siteName,shortDescription,logo,address,directionsUrl,officeContacts[]{name,phone},corporateContacts[]{name,phone},whatsapp,socialLinks[]{label,url},seo{title,description,image}}`,
);
export const HOME_QUERY = defineQuery(
  `*[_type == "homePage" && _id == "homePage"][0]{heading,supportingLine,hero,heroMediaType,"heroVideoUrl":heroVideo.asset->url,introduction,highlights,occasions,dayCapacity,overnightCapacity,featuredPackages[]-> [active == true]{_id,name,slug,summary,cover},featuredGallery[]->{_id,kind,photo,caption,category,videoUrl,"videoFileUrl":videoFile.asset->url,poster}}`,
);
export const PACKAGES_QUERY = defineQuery(
  `*[_type == "package" && active == true] | order(displayOrder asc){_id,name,slug,category,accommodation,summary,cover,gallery,price,currency,pricingUnit,vegetarianPrice,nonVegetarianPrice,arrival,departure,departureDayOffset,inclusions,exclusions,rules,seo{title,description,image}}`,
);
export const AMENITIES_QUERY = defineQuery(
  `*[_type == "amenity" && active == true] | order(displayOrder asc){_id,name,category,description,image,icon}`,
);
export const GALLERY_QUERY = defineQuery(
  `*[_type == "galleryItem"] | order(displayOrder asc){_id,kind,photo,videoUrl,"videoFileUrl":videoFile.asset->url,poster,caption,category,featured}`,
);
export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial" && approved == true]{_id,guestName,review,rating,sourceUrl}`,
);
export const ABOUT_QUERY = defineQuery(
  `*[_type == "aboutPage" && _id == "aboutPage"][0]{story,images,petInformation,petRules,occasions}`,
);
export const POLICY_QUERY = defineQuery(
  `*[_type == "policyPage" && slug.current == $slug][0]{title,body,lastUpdated}`,
);
