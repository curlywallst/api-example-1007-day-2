class TodoSerializer < ActiveModel::Serializer
  attributes :id, :description, :completed
end
