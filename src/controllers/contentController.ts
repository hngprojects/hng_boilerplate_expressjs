import { Request, Response } from "express";

export class contentController {
    constructor() {
    }
}

// {
//     "title": "More Than Just A BoilerPlate",
//     "introduction": "Welcome to Hng Boilerplate, where passion meets innovation.",
//     "custom_sections": {
//       "stats": {
//         "years_in_business": 10,
//         "customers": 75000,
//         "monthly_blog_readers": 100000,
//         "social_followers": 1200000
//       },
//       "services": {
//         "title": "Trained to Give You The Best",
//         "description": "Since our founding, Hng Boilerplate has been dedicated to constantly evolving to stay ahead of the curve."
//       }
//     },
//   "status_code": 200,
//   "message": "Retrieved About Page content successfully"
// }

export class AboutContentController extends contentController{
    //retrieves current content of about page
    async getContent(req: Request, res: Response) {
        try {
            //check if user is authenticated
            if (typeof req?.user === "undefined") {
                return res.status(401).json({
                    message: "Invalid authentication credentials",
                    status_code: 401,
                });
            }

            //check if authenticated user is authorized to access this resource
            if (req.user && Object.keys(req.user) && req.user?.role !== "admin") {
                return res.status(403).send({
                    message:
                        "You do not have the necessary permissions to access this resource",
                    status_code: 403,
                });
            }

            //////////////////////////////////////////database implementation here

            return res.status(200).json({
                title: "More Than Just A BoilerPlate",
                introduction:
                    "Welcome to Hng Boilerplate, where passion meets innovation.",
                custom_sections: {
                    stats: {
                        years_in_business: 10,
                        customers: 75000,
                        monthly_blog_readers: 100000,
                        social_followers: 1200000,
                    },
                    services: {
                        title: "Trained to Give You The Best",
                        description:
                            "Since our founding, Hng Boilerplate has been dedicated to constantly evolving to stay ahead of the curve.",
                    },
                },
                status_code: 200,
                message: "Retrieved About Page content successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve About page content.",
                status_code: 500,
            });
        }
    }
}
