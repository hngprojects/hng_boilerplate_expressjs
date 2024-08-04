import AppDataSource from "../data-source";
import { TestimonialEntity } from "../models";
import { DeleteResult, Repository } from "typeorm";
import { BadRequest, ResourceNotFound } from "../middleware";

export class TestimonialService {
  private testimonialRepository: Repository<TestimonialEntity>;

  constructor() {
    this.testimonialRepository = AppDataSource.getRepository(TestimonialEntity);
  }

  public async createTestimonial(
    client_name: string,
    client_position: string,
    testimonial: string,
  ): Promise<{ testimonial: TestimonialEntity; message: string }> {
    const testimonialEntity = this.testimonialRepository.create({
      client_name,
      client_position,
      testimonial,
    });

    const newTestimonial =
      await this.testimonialRepository.save(testimonialEntity);

    return {
      testimonial: newTestimonial,
      message: "Testimonial Created Succesfully",
    };
  }

  public async getTestimonial(
    testimonial_id: string,
  ): Promise<{ testimonial: TestimonialEntity; message: string }> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id: testimonial_id },
    });

    if (!testimonial) {
      throw new BadRequest("Invalid Testimonial");
    }

    return {
      testimonial: testimonial,
      message: "Fetch Succesful",
    };
  }

  public async getAllTestimonials(): Promise<{
    testimonials: TestimonialEntity[];
    message: string;
  }> {
    const testimonials = await this.testimonialRepository.find();

    return {
      testimonials: testimonials,
      message: "Fetch Succesful",
    };
  }

  public async deleteTestimonial(
    testimonial_id: string,
  ): Promise<{ testimonial: DeleteResult; message: string }> {
    const testimonialToDelete = await this.testimonialRepository.findOne({
      where: { id: testimonial_id },
    });

    if (!testimonialToDelete) {
      throw new ResourceNotFound("Testimonial does not exist!");
    }

    const testimonial = await this.testimonialRepository.delete({
      id: testimonial_id,
    });

    return {
      testimonial: testimonial,
      message: "Testimonial Deleted Succesfully",
    };
  }
}
