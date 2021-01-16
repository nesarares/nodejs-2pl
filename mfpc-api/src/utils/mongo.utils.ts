import { ObjectId } from 'mongodb';

export class MongoUtils {
  public static buildLookup(
    from: string,
    localField: string,
    foreignField: string,
    as: string,
    unwind = true,
    preserveNullAndEmptyArrays = true
  ) {
    return [
      { $lookup: { from, localField, foreignField, as } },
      ...(unwind
        ? [
            {
              $unwind: {
                path: `$${as}`,
                preserveNullAndEmptyArrays,
              },
            },
          ]
        : []),
    ];
  }

  public static toObjectId(data: any) {
    return new ObjectId(data.toString());
  }
}
