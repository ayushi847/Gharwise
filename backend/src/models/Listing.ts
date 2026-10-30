





// import mongoose, { Schema, Document } from 'mongoose';

// export interface IListingImage {
//   url: string;
//   publicId: string;
//   createdAt: Date;
// }

// export interface IListing extends Document {
//   ownerId: mongoose.Types.ObjectId;

//   // Existing property details
//   title: string;
//   location: string;
//   rent: number;
//   availableFrom: Date;
//   roomType: 'SINGLE' | 'SHARED' | 'STUDIO' | 'APARTMENT' | 'PG';
//   furnishing: 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
//   description: string;

//   // New property details
//   occupancyOptions: string[];
//   commonAmenities: string[];
//   foodAndKitchen: string[];
//   otherCharges: string[];
//   houseRules: string[];
//   neighbourhood: string;
//   contactPhone: string;
//   whatsappNumber: string;

//   // Existing fields
//   status: 'ACTIVE' | 'FILLED' | 'DELETED';
//   images: IListingImage[];
//   owner?: any;
//   interestsCount?: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ListingImageSchema: Schema = new Schema({
//   url: { type: String, required: true },
//   publicId: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const ListingSchema: Schema = new Schema(
//   {
//     ownerId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },

//     // Existing property details
//     title: { type: String, required: true, trim: true },
//     location: { type: String, required: true, trim: true },
//     rent: { type: Number, required: true },
//     availableFrom: { type: Date, required: true },

//     roomType: {
//       type: String,
//       enum: ['SINGLE', 'SHARED', 'STUDIO', 'APARTMENT', 'PG'],
//       required: true,
//     },

//     furnishing: {
//       type: String,
//       enum: ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'],
//       required: true,
//     },

//     description: { type: String, required: true },

//     // New property details
//     occupancyOptions: {
//       type: [String],
//       default: [],
//     },

//     commonAmenities: {
//       type: [String],
//       default: [],
//     },

//     foodAndKitchen: {
//       type: [String],
//       default: [],
//     },

//     otherCharges: {
//       type: [String],
//       default: [],
//     },

//     houseRules: {
//       type: [String],
//       default: [],
//     },

//     neighbourhood: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     contactPhone: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     whatsappNumber: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     // Existing status and images
//     status: {
//       type: String,
//       enum: ['ACTIVE', 'FILLED', 'DELETED'],
//       default: 'ACTIVE',
//     },

//     images: [ListingImageSchema],
//   },
//   { timestamps: true }
// );

// // Virtual for owner details
// ListingSchema.virtual('owner', {
//   ref: 'User',
//   localField: 'ownerId',
//   foreignField: '_id',
//   justOne: true,
// });

// // Virtual for interests count
// ListingSchema.virtual('interestsCount', {
//   ref: 'Interest',
//   localField: '_id',
//   foreignField: 'listingId',
//   count: true,
// });

// ListingSchema.set('toJSON', { virtuals: true });
// ListingSchema.set('toObject', { virtuals: true });

// export default mongoose.model<IListing>('Listing', ListingSchema);

















import mongoose, { Schema, Document } from 'mongoose';

export interface IListingImage {
  url: string;
  publicId: string;
  createdAt: Date;
}

export interface IListing extends Document {
  ownerId: mongoose.Types.ObjectId;

  // Property details
  title: string;
  location: string;
  rent: number;
  availableFrom: Date;
  roomType: 'SINGLE' | 'SHARED' | 'STUDIO' | 'APARTMENT' | 'PG';
  furnishing: 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  description: string;

  // Additional property details
  occupancyOptions: string[];
  commonAmenities: string[];
  foodAndKitchen: string[];
  otherCharges: string[];
  houseRules: string[];
  neighbourhood: string;
  contactPhone: string;
  whatsappNumber: string;

  // Status and images
  status: 'ACTIVE' | 'FILLED' | 'DELETED';
  images: IListingImage[];

  // Virtual fields
  owner?: any;
  interestsCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ListingImageSchema = new Schema<IListingImage>({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ListingSchema = new Schema<IListing>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Required property details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['SINGLE', 'SHARED', 'STUDIO', 'APARTMENT', 'PG'],
      required: true,
    },
    furnishing: {
      type: String,
      enum: ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // Store additional details as string arrays
    occupancyOptions: {
      type: [String],
      default: [],
    },
    commonAmenities: {
      type: [String],
      default: [],
    },
    foodAndKitchen: {
      type: [String],
      default: [],
    },
    otherCharges: {
      type: [String],
      default: [],
    },
    houseRules: {
      type: [String],
      default: [],
    },

    // Additional text and contact fields
    neighbourhood: {
      type: String,
      default: '',
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '',
      trim: true,
    },

    // Listing status
    status: {
      type: String,
      enum: ['ACTIVE', 'FILLED', 'DELETED'],
      default: 'ACTIVE',
    },

    // Property images
    images: {
      type: [ListingImageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for owner details
ListingSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for interests count
ListingSchema.virtual('interestsCount', {
  ref: 'Interest',
  localField: '_id',
  foreignField: 'listingId',
  count: true,
});

// Include virtual fields in API responses
ListingSchema.set('toJSON', {
  virtuals: true,
});

ListingSchema.set('toObject', {
  virtuals: true,
});

export default mongoose.model<IListing>('Listing', ListingSchema);
