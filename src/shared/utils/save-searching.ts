import { SearchingData } from '@models/searching-data.model';
import { User } from '@models/user.model';

export const saveSearchingData = async (
  user_id: number,
  url: string,
  dto: any,
  candidate_information_id: number,
) => {
  const {
    search,
    province_ids,
    career_ids,
    years_of_experience_ids,
    salary_range_ids,
    professional_field_ids,
    position_ids,
    ...rest
  } = dto;
  //Kiểm tra trước đó đã tồn tại thông tin tìm kiếm của người dùng chưa
  const foundSearching = await SearchingData.findOne({
    where: {
      user_id,
    },
  });

  //Xử lí metadata
  const metadata = {
    url,
    search: search,
    province_ids: province_ids?.split(',').map((id: any) => parseInt(id)),
    career_ids: career_ids?.split(',').map((id: any) => parseInt(id)),
    years_of_experience_ids: years_of_experience_ids
      ?.split(',')
      .map((id: any) => parseInt(id)),
    salary_range_ids: salary_range_ids
      ?.split(',')
      .map((id: any) => parseInt(id)),
    professional_field_ids: professional_field_ids
      ?.split(',')
      .map((id: any) => parseInt(id)),
    position_ids: position_ids?.split(',').map((id: any) => parseInt(id)),
    candidate_information_id,
    another_data: { ...rest },
    user_id,
  };
  if (foundSearching) {
    //Nếu có => cập nhật
    await SearchingData.update(
      {
        metadata: JSON.stringify(metadata),
      },
      {
        where: {
          id: foundSearching.id,
        },
      },
    );
  } else {
    //Chưa có => tạo mới
    await SearchingData.create({
      metadata: JSON.stringify(metadata),
      user_id,
    });
  }
};

export const saveSearchingDataFromInterest = async (
  user_id: number,
  dto: any,
  candidate_information_id: number,
) => {
  const {
    province_ids,
    career_ids,
    years_of_experience_ids,
    salary_range_ids,
    professional_field_ids,
    position_ids,
    ...rest
  } = dto;
  //Kiểm tra trước đó đã tồn tại thông tin tìm kiếm của người dùng chưa
  const foundSearching = await SearchingData.findOne({
    where: {
      user_id,
    },
  });

  //Xử lí metadata
  const metadata = {
    province_ids: [...province_ids],
    career_ids: [...career_ids],
    years_of_experience_ids: [years_of_experience_ids],
    salary_range_ids: [salary_range_ids],
    professional_field_ids: [professional_field_ids],
    position_ids: [position_ids],
    candidate_information_id,
    another_data: { ...rest },
    user_id,
  };
  if (foundSearching) {
    //Nếu có => cập nhật
    await SearchingData.update(
      {
        metadata: JSON.stringify(metadata),
      },
      {
        where: {
          id: foundSearching.id,
        },
      },
    );
  } else {
    //Chưa có => tạo mới
    await SearchingData.create({
      metadata: JSON.stringify(metadata),
      user_id,
    });
  }
};

export const switchAutoSaveSearchingData = async (user_id: number) => {
  //Kiểm tra trước đó đã tồn tại thông tin tìm kiếm của người dùng chưa
  const foundUser = await User.findOne({
    where: {
      id: Number(user_id),
    },
  });

  const update_data = foundUser?.is_save_searching == 1 ? 0 : 1;

  await User.update(
    {
      is_save_searching: update_data,
    },
    {
      where: {
        id: user_id,
      },
    },
  );
};
